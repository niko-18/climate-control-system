package com.example.server.repository;

import com.example.server.entity.Range;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RangeRepository extends JpaRepository<Range, Integer> {
}
